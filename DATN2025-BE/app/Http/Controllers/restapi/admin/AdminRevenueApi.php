<?php

namespace App\Http\Controllers\restapi\admin;

use App\Http\Controllers\Controller;
use App\Models\Revenues;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class AdminRevenueApi extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/admin/revenues/list",
     *     summary="Get list of revenues",
     *     description="Get list of revenues",
     *     tags={"Revenue"},
     *     @OA\Response(
     *         response=200,
     *         description="successful operation"
     *     )
     * )
     */
    public function list()
    {
        $revenues = Revenues::orderBy('id', 'desc')->get();
        $data = returnMessage(1, $revenues, 'Success');
        return response($data, 200);
    }

    /**
     * @OA\Get(
     *     path="/api/admin/revenues/charts",
     *     summary="Get chart statistics of revenues",
     *     description="Get chart statistics of revenues",
     *     tags={"Revenue"},
     *     @OA\Response(
     *         response=200,
     *         description="successful operation"
     *     )
     * )
     */
    public function charts(Request $request)
    {
        $type = $request->input('type');

        if ($type === 'day') {
            $res = $this->daySearch();
        } elseif ($type === 'year') {
            $res = $this->yearSearch();
        } else {
            $res = $this->monthSearch();
        }

        $data = returnMessage(1, $res, 'Success');
        return response($data, 200);
    }

    private function daySearch()
    {
        $xData = [];
        $yData = [];

        for ($i = 11; $i >= 0; $i--) {
            $day = now()->subDays($i)->format('d/m'); // Format as 'day/month' (e.g., '01/01')
            $xData[] = $day;
            $yData[] = 0;
        }

        $revenues = Revenues::whereBetween('created_at', [
            now()->subDays(11)->startOfDay(),
            now()->endOfDay()
        ])->get();

        $total = 0;

        foreach ($revenues as $revenue) {
            $dayIndex = now()->diffInDays($revenue->created_at->startOfDay());
            if ($dayIndex < 12) {
                $yData[11 - $dayIndex] += $revenue->total;
            }

            $total += $revenue->total;
        }

        return ['x_data' => $xData, 'y_data' => $yData, 'total' => $total];
    }

    private function monthSearch()
    {
        $vMonths = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

        $xData = [];
        $yData = [];

        for ($i = 11; $i >= 0; $i--) {
            $monthIndex = now()->subMonths($i)->format('n') - 1;
            $xData[] = $vMonths[$monthIndex];
            $yData[] = 0;
        }

        $revenues = Revenues::whereBetween('created_at', [
            now()->subMonths(11)->startOfMonth(),
            now()->endOfMonth()
        ])->get();

        $total = 0;

        foreach ($revenues as $revenue) {
            $monthIndex = now()->diffInMonths($revenue->created_at->startOfMonth());
            if ($monthIndex < 12) {
                $yData[11 - $monthIndex] += $revenue->total;
            }

            $total += $revenue->total;
        }

        return ['x_data' => $xData, 'y_data' => $yData, 'total' => $total];
    }

    private function yearSearch()
    {
        $xData = [];
        $yData = [];

        for ($i = 11; $i >= 0; $i--) {
            $year = now()->subYears($i)->format('Y');
            $xData[] = $year;
            $yData[] = 0;
        }

        $revenues = Revenues::whereBetween('created_at', [
            now()->subYears(11)->startOfYear(),
            now()->endOfYear()
        ])->get();

        $total = 0;

        foreach ($revenues as $revenue) {
            $yearIndex = now()->diffInYears($revenue->created_at->startOfYear());
            if ($yearIndex < 12) {
                $yData[11 - $yearIndex] += $revenue->total;
            }

            $total += $revenue->total;
        }

        return ['x_data' => $xData, 'y_data' => $yData, 'total' => $total];
    }
}
