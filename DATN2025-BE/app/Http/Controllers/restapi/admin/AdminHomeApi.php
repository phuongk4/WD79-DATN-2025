<?php

namespace App\Http\Controllers\restapi\admin;

use App\Enums\OrderStatus;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\Orders;
use App\Models\Revenues;
use App\Models\User;
use Carbon\Carbon;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminHomeApi extends Controller
{
    protected $now;

    public function __construct()
    {
        Carbon::now('Asia/Ho_Chi_Minh');
        $this->now = (new DateTime())->format('Y-m-d H:i:s');
    }

    public function dashboard(Request $request)
    {
        try {
            $type = $request->input('type');
            $size = $request->input('size');
            $sort = $request->input('sort');
            $keyword = $request->input('keyword');

            $data = [
                'order_action' => $this->calculateOrder($type, $size, $sort, $keyword),
                'member_action' => $this->calculateMembers($type, $size, $sort, $keyword),
                'revenue_action' => $this->calculateRevenue($type, $size, $sort, $keyword),
                'product_action' => $this->getTopProduct($type, $size, $sort, $keyword),
            ];

            $res = returnMessage(1, $data, 'Success');
            return response($res, 200);
        } catch (\Exception $exception) {
            Log::error('Dashboard Error: ' . $exception->getMessage());
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }

    public function chartOrders(Request $request)
    {
        $type = $request->input('type');
        $date = Carbon::now();

        $query = Orders::where('status', '!=', OrderStatus::DELETED);

        switch ($type) {
            case 'day':
                if ($date) {
                    $query->whereDate('created_at', $date);
                }
                break;
            case 'year':
                if ($date) {
                    $year = date('Y', strtotime($date));
                    $query->whereYear('created_at', $year);
                }
                break;

            default:
                if ($date) {
                    $month = date('m', strtotime($date));
                    $year = date('Y', strtotime($date));
                    $query->whereMonth('created_at', $month)->whereYear('created_at', $year);
                }
                break;
        }

        $orders = $query->get();
        $count = $orders->count();
        $pendingOrders = $orders->where('status', OrderStatus::PENDING)->count();
        $processOrders = $orders->where('status', OrderStatus::PROCESSING)->count();
        $confirmOrders = $orders->where('status', OrderStatus::CONFIRMED)->count();
        $shippingOrders = $orders->where('status', OrderStatus::SHIPPING)->count();
        $deliveredOrders = $orders->where('status', OrderStatus::DELIVERED)->count();
        $canceledOrders = $orders->where('status', OrderStatus::CANCELED)->count();
        $completedOrders = $orders->where('status', OrderStatus::COMPLETED)->count();

        $data = [
            'total' => $count,
            'pending' => $pendingOrders,
            'process' => $processOrders,
            'confirm' => $confirmOrders,
            'shipping' => $shippingOrders,
            'delivered' => $deliveredOrders,
            'completed' => $completedOrders,
            'canceled' => $canceledOrders
        ];

        $res = returnMessage(1, $data, 'Success');
        return response($res, 200);
    }

    public function getTopProduct($type, $size, $sort, $keyword)
    {
        $topProducts = DB::table('products as p')
            ->join('order_items as oi', 'p.id', '=', 'oi.product_id')
            ->select('p.id', 'p.name', 'p.sale_price', 'p.thumbnail', DB::raw('SUM(oi.quantity) as total_sold'))
            ->groupBy('p.id', 'p.name', 'p.sale_price', 'p.thumbnail')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get();

        return [
            'top_products' => $topProducts,
        ];
    }

    private function calculateMembers($type, $size, $sort, $keyword)
    {
        $members = User::where('status', '!=', UserStatus::DELETED);

        $totalMembers = $members->count();

        $currentMember = $members->whereBetween('created_at', [
            Carbon::parse($this->now)->startOfMonth(),
            Carbon::parse($this->now)->endOfMonth()
        ])->count();

        $prevMembers = $members->whereBetween('created_at', [
            Carbon::parse($this->now)->subMonth()->startOfMonth(),
            Carbon::parse($this->now)->subMonth()->endOfMonth()
        ])->count();

        $is_increase = $currentMember >= $prevMembers;

        if ($prevMembers === 0 && $currentMember > 0) {
            $percentChange = $currentMember * 100;
        } elseif ($prevMembers > 0) {
            $percentChange = round(abs(($currentMember - $prevMembers) / $prevMembers) * 100, 2);
        } else {
            $percentChange = 0;
        }

        return [
            'total_member' => $totalMembers,
            'current_member' => $currentMember,
            'prev_member' => $prevMembers,
            'is_increase' => $is_increase,
            'percent_change' => $percentChange,
        ];
    }

    private function calculateOrder($type, $size, $sort, $keyword)
    {
        $orders = Orders::where('status', '!=', OrderStatus::CANCELED)
            ->where('status', '!=', OrderStatus::DELETED);

        $totalOrder = $orders->count();

        $currentOrder = $orders->whereBetween('created_at', [
            Carbon::parse($this->now)->startOfMonth(),
            Carbon::parse($this->now)->endOfMonth()
        ])->count();

        $prevOrder = $orders->whereBetween('created_at', [
            Carbon::parse($this->now)->subMonth()->startOfMonth(),
            Carbon::parse($this->now)->subMonth()->endOfMonth()
        ])->count();

        $is_increase = $currentOrder >= $prevOrder;

        if ($prevOrder === 0 && $currentOrder > 0) {
            $percentChange = $currentOrder * 100;
        } elseif ($prevOrder > 0) {
            $percentChange = round(abs(($currentOrder - $prevOrder) / $prevOrder) * 100, 2);
        } else {
            $percentChange = 0;
        }

        $recentOrder = $orders->whereBetween('created_at', [
            Carbon::parse($this->now)->startOfDay(),
            Carbon::parse($this->now)->endOfDay()
        ])->orderByDesc('id')->get();

        return [
            'total_order' => $totalOrder,
            'recent_order' => $recentOrder,
            'current_order' => $currentOrder,
            'prev_order' => $prevOrder,
            'is_increase' => $is_increase,
            'percent_change' => $percentChange,
        ];
    }

//    private function calculateMembers($type, $size, $sort, $keyword)
//    {
//        $time = Carbon::now();
//        return $this->calculateStatistics($time, User::class, 'status', UserStatus::DELETED, 'created_at', $type, $size, $sort, $keyword);
//    }
//
//    private function calculateOrder($type, $size, $sort, $keyword)
//    {
//        $time = Carbon::now();
//        return $this->calculateStatistics($time, Orders::class, 'status', OrderStatus::CANCELED, 'created_at', $type, $size, $sort, $keyword);
//    }

    private function calculateStatistics($time, $modelClass, $statusField, $deletedStatus, $dateField, $type, $size, $sort, $keyword)
    {
        $currentDate = $time;

        $membersQuery = $modelClass::where($statusField, '!=', $deletedStatus);

        $totalCount = $membersQuery->count();

        $currentCount = $membersQuery->where($dateField, '>=', $currentDate->startOfMonth())
            ->where($dateField, '<=', $currentDate->endOfMonth());

        $prevCount = $membersQuery->where($dateField, '>=', $currentDate->subMonth()->startOfMonth())
            ->where($dateField, '<=', $currentDate->subMonth()->endOfMonth());

        $prevCount = $prevCount->count();
        $currentCount = $currentCount->count();
        $isIncrease = $currentCount >= $prevCount;

        if ($prevCount === 0 && $currentCount > 0) {
            $percentChange = 100;
        } elseif ($prevCount > 0) {
            $percentChange = round(abs(($currentCount - $prevCount) / $prevCount) * 100, 2);
        } else {
            $percentChange = 0;
        }

        return [
            'total' => $totalCount,
            'current' => $currentCount,

            'size' => $size,
            'sort' => $sort,
            'keyword' => $keyword,

            'previous' => $prevCount,
            'is_increase' => $isIncrease,
            'percent_change' => $percentChange,
        ];
    }

    private function calculateRevenue($type, $size, $sort, $keyword)
    {
        $totalRevenue = Revenues::sum('total');
        $currentMonth = Carbon::parse($this->now)->month;
        $currentTotalRevenue = Revenues::where('month', $currentMonth)->sum('total');
        $prevTotalRevenue = Revenues::where('month', $currentMonth - 1)->sum('total');

        $is_increase = $currentTotalRevenue >= $prevTotalRevenue;
        $percent = $prevTotalRevenue > 0 ? (($currentTotalRevenue - $prevTotalRevenue) / $prevTotalRevenue) * 100 : 0;

        return [
            'total_revenue' => $totalRevenue,
            'current_total_revenue' => $currentTotalRevenue,
            'prev_total_revenue' => $prevTotalRevenue,
            'is_increase' => $is_increase,
            'percent_change' => round($percent, 2),
        ];
    }

}
