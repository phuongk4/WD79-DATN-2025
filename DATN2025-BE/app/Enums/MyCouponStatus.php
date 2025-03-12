<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class MyCouponStatus extends Enum
{
    const USED = "ĐÃ SỬ DỤNG";
    const UNUSED = "CHƯA SỬ DỤNG";
    const EXPIRED = "HẾT HẠN";
}