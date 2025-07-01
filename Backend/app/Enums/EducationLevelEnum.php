<?php

namespace App\Enums;

enum EducationLevelEnum: string{
    case MIDDLE_SCHOOL = 'middle_school';
    case DIPLOMA = 'diploma';
    case ASSOCIATE = 'associate';
    case BACHELOR = 'bachelor';
    case MASTER = 'master';
    case PHD = 'phd';

    public static function fromFarsi(string $lable): ?self{
        return match(trim($lable)){
            'سیکل' => self::MIDDLE_SCHOOL,
            'دیپلم' => self::DIPLOMA,
            'فوق دیپلم' => self::ASSOCIATE,
            'لیسانس' => self::BACHELOR,
            'فوق لیسانس' => self::MASTER,
            'دکترا' => self::PHD,
            default => null,
        };
        
    }

    public function toFarsi():string{
        return match($this){
            self::MIDDLE_SCHOOL => 'سیکل',
            self::DIPLOMA => 'دیپلم',
            self::ASSOCIATE => 'فوق دیپلم',
            self::BACHELOR => 'لیسانس',
            self::MASTER => 'فوق لیسانس',
            self::PHD => 'دکترا',
        };
    }
}