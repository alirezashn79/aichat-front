import { Outlet } from 'react-router-dom';
import styles from './dashboardLayout.module.css';
import ChatList from '../../features/dashboard/components/chatList/ChatList';

export default function DashboardLayout() {
  return (
    <div className={styles.dashboardLayout}>
      <div className={styles.menu}>
        <ChatList />
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
