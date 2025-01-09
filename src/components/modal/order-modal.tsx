import { useParams } from 'react-router-dom';
import { Modal } from '@components';

interface OrderModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  onClose,
  children
}) => {
  const { number } = useParams();

  return (
    <Modal title={`#${number}`} onClose={onClose}>
      {children}
    </Modal>
  );
};
