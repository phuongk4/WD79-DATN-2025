<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class UserStatus extends Enum
{
    const ACTIVE = 'ĐANG HOẠT ĐỘNG';
    const INACTIVE = 'KHÔNG HOẠT ĐỘNG';
    const BLOCKED = 'ĐÃ KHOÁ';
    const DELETED = 'ĐÃ XOÁ';
}