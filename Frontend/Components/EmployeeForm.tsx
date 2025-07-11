import { TextInput, Text, Select, Button, Group, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import type { Employee } from "../types/employee";
import "../Styles/EmployeeForm.css";

const educationLevelOptions = [
  { value: "middle_school", label: "سیکل" },
  { value: "diploma", label: "دیپلم" },
  { value: "associate", label: "کاردانی" },
  { value: "bachelor", label: "کارشناسی" },
  { value: "master", label: "کارشناسی ارشد" },
  { value: "phd", label: "دکتری" },
];

interface EmployeeFormProps {
  initialValues?: Partial<Employee>;
  onSubmit: (values: Omit<Employee, "id">) => void;
  onCancel: () => void;
}

function EmployeeForm({
  initialValues,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const form = useForm({
    initialValues: {
      FirstName: initialValues?.FirstName || "",
      LastName: initialValues?.LastName || "",
      department: initialValues?.department || "",
      personnel_code: initialValues?.personnel_code || "",
      NationalId: initialValues?.NationalId || "",
      phone: initialValues?.phone || "",
      hire_date: initialValues?.hire_date || "", 
      birth_date: initialValues?.birth_date || "",
      education_level: initialValues?.education_level || "diploma",
    },
  });

  const convertPersianToEnglishNumerals = (str: string): string => {
    const persianNumbers = [
      /۰/g,
      /۱/g,
      /۲/g,
      /۳/g,
      /۴/g,
      /۵/g,
      /۶/g,
      /۷/g,
      /۸/g,
      /۹/g,
    ];
    
    const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    for (let i = 0; i < 10; i++) {
      str = str.replace(persianNumbers[i], englishNumbers[i]);
    }
    return str;
  };

  const handleSubmit = (values: typeof form.values) => {
    const formattedValues: Omit<Employee, "id"> = {
      ...values,
      hire_date: values.hire_date,
      birth_date: values.birth_date,
    };
    console.log("education_level:", values.education_level);
    onSubmit(formattedValues);
    console.log(formattedValues);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <div
        className="mainform"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
        }}
      >
        <TextInput label="نام" required {...form.getInputProps("FirstName")} />
        <TextInput
          label="نام خانوادگی"
          required
          {...form.getInputProps("LastName")}
        />
        <TextInput
          label="دپارتمان"
          required
          {...form.getInputProps("department")}
        />
        <TextInput
          label="کد پرسنلی"
          required
          {...form.getInputProps("personnel_code")}
        />
        <TextInput
          label="کدملی"
          required
          {...form.getInputProps("NationalId")}
        />
        <TextInput label="تلفن" required {...form.getInputProps("phone")} />
        <Select
          label="سطح تحصیلات"
          required
          data={educationLevelOptions}
          {...form.getInputProps("education_level")}
        />

        <Box mb="sm">
          <Text className="DateTitle">تاریخ استخدام</Text>
          <DatePicker
            required
            className="Date"
            inputClass="rmdp-input"
            format="YYYY-MM-DD"
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            containerStyle={{ width: "100%" }}
            value={form.values.hire_date || ""}
            onChange={(date) => {
              const formatted = date?.format?.("YYYY-MM-DD") || "";

              const englishNumeralsFormatted =
                convertPersianToEnglishNumerals(formatted);
              form.setFieldValue("hire_date", englishNumeralsFormatted);
            }}
          />
        </Box>

        <Box mb="sm">
          <Text className="DateTitle">تاریخ تولد</Text>
          <DatePicker
            required
            className="Date"
            inputClass="rmdp-input"
            format="YYYY-MM-DD"
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            containerStyle={{ width: "100%" }}
            value={form.values.birth_date || ""}
            onChange={(date) => {
              const formatted = date?.format?.("YYYY-MM-DD") || "";
              const englishNumeralsFormatted =
                convertPersianToEnglishNumerals(formatted);
              form.setFieldValue("birth_date", englishNumeralsFormatted);
            }}
          />
        </Box>
      </div>

      <Group className="buttonGoup" justify="flex-end" mt="md">
        <Button variant="outline" onClick={onCancel}>
          انصراف
        </Button>
        <Button type="submit" color="blue">
          {initialValues ? "ذخیره تغییرات" : "افزودن کارمند"}
        </Button>
      </Group>
    </form>
  );
}

export default EmployeeForm;
