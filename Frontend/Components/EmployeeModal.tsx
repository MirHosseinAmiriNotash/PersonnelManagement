import { Modal, TextInput, Button, Group, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import { Input } from '@mantine/core';
import { Employee } from '../types/employee';

interface EmployeeModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: Employee) => void;
  initialValues?: Partial<Employee>;
  mode: 'add' | 'edit';
}

export function EmployeeModal({
  opened,
  onClose,
  onSubmit,
  initialValues,
  mode
}: EmployeeModalProps) {
  const form = useForm<Employee>({
    initialValues: {
      id: 0,
      FirstName: '',
      LastName: '',
      department: '',
      personnel_code: '',
      NationalId: '',
      phone: '',
      hire_date: new Date(),
      birth_date: new Date(),
      education_level: 'diploma',
      ...initialValues
    },

    validate: {
      FirstName: (value) => (value ? null : 'نام الزامی است'),
      LastName: (value) => (value ? null : 'نام خانوادگی الزامی است'),
      NationalId: (value) => (value.length === 10 || value.length === 11 ? null : 'کدملی باید 10 یا 11 رقم باشد')
    }
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={mode === 'add' ? 'افزودن کارمند جدید' : 'ویرایش کارمند'}
      size="lg"
      centered
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          label="نام"
          {...form.getInputProps('FirstName')}
          mb="sm"
        />
        
        <TextInput
          label="نام خانوادگی"
          {...form.getInputProps('LastName')}
          mb="sm"
        />
        
        <Select
          label="سطح تحصیلات"
          data={[
            { value: 'middle_school', label: 'سیکل' },
            { value: 'diploma', label: 'دیپلم' },
            { value: 'associate', label: 'کاردانی' },
            { value: 'bachelor', label: 'کارشناسی' },
            { value: 'master', label: 'کارشناسی ارشد'},
            { value: 'phd', label: 'دکترا' },
            
          ]}
          {...form.getInputProps('education_level')}
          mb="sm"
        />
        <Input.Wrapper label="تاریخ استخدام">
        <DatePicker
          
          {...form.getInputProps('hire_date')}
          mb="sm"
        />
        </Input.Wrapper>
        
        <Group justify="flex-end" mt="md">
          <Button type="submit">
            {mode === 'add' ? 'افزودن' : 'ذخیره تغییرات'}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}