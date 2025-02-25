<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class AttributeStatus extends Enum
{
    const ACTIVE = 'ĐANG HOẠT ĐỘNG';
    const INACTIVE = 'KHÔNG HOẠT ĐỘNG';
    const DELETED = 'ĐÃ XOÁ';
}
