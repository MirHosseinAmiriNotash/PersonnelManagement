import { modals } from '@mantine/modals';
import { Button, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';

interface DeleteConfirmationModalProps {
  onConfirm: () => Promise<void>;
  itemName: string;
}

export const openDeleteModal = ({ onConfirm, itemName }: DeleteConfirmationModalProps) => {
  modals.openConfirmModal({
    title: 'تأیید حذف',
     centered: true,
    children: (
      <Text size="sm">
        آیا از حذف {itemName} مطمئن هستید؟ این عمل غیرقابل بازگشت است.
      </Text>
    ),
    labels: { confirm: 'حذف', cancel: 'انصراف' },
    confirmProps: { color: 'red' },
    onConfirm: async () => {
      try {
        await onConfirm();
        notifications.show({
          title: 'عملیات موفق',
          message: `${itemName} با موفقیت حذف شد`,
          color: 'green',
        });
      } catch (error) {
        notifications.show({
          title: 'خطا',
          message: 'عملیات حذف انجام نشد',
          color: 'red',
        });
      }
    },
  });
};