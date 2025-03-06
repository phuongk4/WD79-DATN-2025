<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class OrderMethod extends Enum
{
    const IMMEDIATE = "Thanh toán khi nhận hàng";
    const ELECTRONIC_WALLET = "Ví điện tử";
    const CARD_CREDIT = "Thẻ ghi nợ hoặc thẻ tín dụng";
}
