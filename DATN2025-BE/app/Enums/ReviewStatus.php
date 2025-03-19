<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ReviewStatus extends Enum
{
    const PENDING = 'CHỜ PHÊ DUYỆT';
    const APPROVED = 'ĐƯỢC CHẤP NHẬN';
    const DELETED = 'ĐÃ XOÁ';
    const REJECTED = 'ĐÃ TỪ CHỐI';
}
