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
  { value: "associate", label: "فوق دیپلم" },
  { value: "bachelor", label: "لیسانس" },
  { value: "master", label: "فوق لیسانس" },
  { value: "phd", label: "دکترا" },
];
console.log(educationLevelOptions[5]);

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
    validate: {
      FirstName: (value) => (value ? null : "نام نمی‌تواند خالی باشد"),
      LastName: (value) => (value ? null : "نام خانوادگی نمی‌تواند خالی باشد"),
      department: (value) => (value ? null : "دپارتمان نمی‌تواند خالی باشد"),
      personnel_code: (value) =>
        value && value.length > 5 && value.length < 26 && /^\d+$/.test(value)
          ? null
          : "کد پرسنلی باید بیشتر از 5 رقم و کمتر از 25 رقم و فقط عدد باشد",
      NationalId: (value) => {
        if (!value || value.trim().length === 0) return "کد ملی را وارد کنید";

        if (!/^(\d{10})$/.test(value)) {
          return "کد ملی باید ۱۰ رقم باشد";
        }
        return null;
      },
      phone: (value) =>
        value &&
        value.length === 11 &&
        /^\d+$/.test(value) &&
        value.startsWith("09")
          ? null
          : "لطفا شماره تلفن معتبر وارد کنید(با 09 شروع شود و 11 رقم باشد)",
      hire_date: (value) =>
        value ? null : "تاریخ استخدام نمی‌تواند خالی باشد",
      birth_date: (value) => (value ? null : "تاریخ تولد نمی‌تواند خالی باشد"),
      education_level: (value) => (value ? null : "سطح تحصیلات را انتخاب کنید"),
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

  const handleNumericInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof Employee,
    maxLength: number
  ) => {
    const inputValue = event.currentTarget.value;

    const filteredValue = inputValue.replace(/[^0-9]/g, "");

    const truncatedValue = filteredValue.slice(0, maxLength);

    form.setFieldValue(fieldName, truncatedValue);
  };

  return (
    <form id="form" onSubmit={form.onSubmit(handleSubmit)}>
      <div
        className="mainform"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
        }}
      >
        <TextInput
          id="EmployeeFname"
          label="نام"
          maxLength={50}
          {...form.getInputProps("FirstName")}
        />
        <TextInput
          id="EmployeeLname"
          label="نام خانوادگی"
          maxLength={50}
          {...form.getInputProps("LastName")}
        />
        <TextInput
          id="EmployeeDepartment"
          label="دپارتمان"
          maxLength={50}
          {...form.getInputProps("department")}
        />
        <TextInput
          id="EmployeePersonnel_code"
          label="کد پرسنلی"
          placeholder="مثال: 12345"
          type="text"
          onChange={(event) =>
            handleNumericInputChange(event, "personnel_code", 25)
          }
          value={form.values.personnel_code}
          error={form.errors.personnel_code}
        />
        <TextInput
          id="EmployeeNid"
          label="کدملی"
          placeholder="مثال: 13635XXXXX"
          type="text"
          onChange={(event) =>
            handleNumericInputChange(event, "NationalId", 10)
          }
          value={form.values.NationalId}
          error={form.errors.NationalId}
        />
        <TextInput
          id="EmployeePhoneNumber"
          label="تلفن"
          placeholder="مثال: 0914XXXXXXX"
          type="text"
          onChange={(event) => handleNumericInputChange(event, "phone", 11)}
          value={form.values.phone}
          error={form.errors.phone}
        />
        <Select
          id="EmployeeEducation_level"
          label="سطح تحصیلات"
          data={educationLevelOptions}
          {...form.getInputProps("education_level")}
        />

        <Box mb="sm">
          <Text className="DateTitle">تاریخ استخدام</Text>
          <DatePicker
            id="EmployeeHire_date"
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
          {form.errors.hire_date && (
            <Text id="EmployeeHire_date-error" size="xs" color="red" mt={4}>
              {form.errors.hire_date}
            </Text>
          )}
        </Box>

        <Box mb="sm">
          <Text className="DateTitle">تاریخ تولد</Text>
          <DatePicker
            id="EmployeeBirth_date"
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
          {form.errors.birth_date && (
            <Text id="EmployeeBirth_date-error" size="xs" color="red" mt={4}>
              {form.errors.birth_date}
            </Text>
          )}
        </Box>
      </div>

      <Group className="buttonGoup" justify="flex-end" mt="md">
        <Button id="cancelButton" variant="outline" onClick={onCancel}>
          انصراف
        </Button>
        <Button id="saveEmployeeBtn" type="submit" color="blue">
          {initialValues ? "ذخیره تغییرات" : "افزودن کارمند"}
        </Button>
      </Group>
    </form>
  );
}

export default EmployeeForm;
