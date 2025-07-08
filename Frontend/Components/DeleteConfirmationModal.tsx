import { Modal, Button, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useState, type ReactNode } from "react";

interface DeleteConfirmationModalProps {
  onConfirm: () => Promise<void>;
  children: (open: () => void) => ReactNode;
  title?: string;
  message?: string;
}

export function DeleteConfirmationModal({
  onConfirm,
  children,
  title = "آیا مطمئن هستید؟",
  message = "آیا از حذف این آیتم اطمینان دارید؟ این عمل قابل بازگشت نیست.",
}: DeleteConfirmationModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      close();
    } catch (error) {
      notifications.show({
        title: "خطا",
        message: "عملیات حذف با خطا مواجه شد",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {children(open)}

      <Modal opened={opened} onClose={close} title={title}>
        <Text>{message}</Text>
        <Group mt="lg" justify="flex-end">
          <Button onClick={close} variant="default" disabled={isLoading}>
            انصراف
          </Button>
          <Button onClick={handleConfirm} color="red" loading={isLoading}>
            حذف
          </Button>
        </Group>
      </Modal>
    </>
  );
}
