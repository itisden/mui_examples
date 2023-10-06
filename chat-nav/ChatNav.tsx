import ChatNavLayout from './ChatNavLayout';
import ChatNavContent from './ChatNavContent';

type Props = {};

export default function ChatNav(props: Props) {
  return (
    <ChatNavLayout>
      <ChatNavContent />
    </ChatNavLayout>
  );
}
