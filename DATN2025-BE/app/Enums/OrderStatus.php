<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class OrderStatus extends Enum
{
    const PENDING = 'CHỜ XÁC NHẬN';
    const PROCESSING = 'ĐANG XỬ LÝ';
    const CONFIRMED = 'ĐÃ XÁC NHẬN';
    const SHIPPING = 'ĐANG VẬN CHUYỂN';
    const DELIVERED = 'ĐÃ GIAO HÀNG';
    const COMPLETED = 'ĐÃ HOÀN THÀNH';
    const CANCELED = 'ĐÃ HỦY';
    const DELETED = 'ĐÃ XÓA';
}
