import LogoImage from '@assets/images/logo.png';
import { Link } from 'react-router-dom';
import styles from './chatList.module.css';
import { useGetUserChats } from '../../hooks/queries/useGetUserChats';
const ChatList = () => {
  const { isPending, error, data } = useGetUserChats();
  return (
    <div className={styles.chatList}>
      <span className={styles.title}>DASHBOARD</span>
      <Link to='/dashboard'>Create a new Chat</Link>
      <Link to='/'>Explore Alireza AI</Link>
      <Link to='/'>Contact</Link>
      <hr />
      <span className={styles.title}>RECENT CHATS</span>
      <div className={styles.list}>
        {isPending
          ? 'Loading...'
          : error
            ? 'Something went wrong!'
            : data?.map((chat) => (
                <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
                  {chat.title}
                </Link>
              ))}
      </div>
      <hr />
      <div className={styles.upgrade}>
        <img src={LogoImage} alt='Alireza Ai' />
        <div className={styles.texts}>
          <span>Upgrade to Alireza AI Pro</span>
          <span>Get unlimited access to all features</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
