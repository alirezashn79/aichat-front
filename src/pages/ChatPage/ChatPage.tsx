import NewPrompt from '@/features/chat/components/NewPrompt/NewPrompt';
import { useChat } from '@/features/chat/hooks/queries/useChat';
import { cn } from '@/utils/cn';
import { useParams } from 'react-router-dom';
import styles from './chatPage.module.css';
import { IKImage } from 'imagekitio-react';
import Markdown from 'react-markdown';
import Highlight from 'react-highlight';
import 'highlight.js/styles/atom-one-dark.css';

const ChatPage = () => {
  const { id } = useParams();
  const { isPending, error, data } = useChat({ chatId: id! });

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert('Code copied to clipboard!');
      })
      .catch(() => {
        alert('Failed to copy code.');
      });
  };

  return (
    <div className={styles.chatPage}>
      <div className={styles.wrapper}>
        <div className={styles.chat}>
          {isPending
            ? 'isLoading'
            : error
              ? 'something wrong'
              : data.history.map((item, index) => (
                  <>
                    {item?.img && (
                      <IKImage
                        key={index}
                        urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                        path={item.img}
                        height='300'
                        width='400'
                        transformation={[{ height: 300, width: 400 }]}
                        loading='lazy'
                        lqip={{ active: true, quality: 20 }}
                      />
                    )}
                    <div
                      key={index}
                      className={cn(
                        styles.message,
                        item.role === 'user' && styles.user,
                      )}>
                      <Markdown
                        components={{
                          code({ className, children, ...props }) {
                            const match = /language-(\w+)/.exec(
                              className || '',
                            );
                            const codeContent = String(children).replace(
                              /\n$/,
                              '',
                            );
                            return match ? (
                              <div className={styles.code_block_wrapper}>
                                <button
                                  className={cn(styles.copyButton)}
                                  onClick={() => copyToClipboard(codeContent)}>
                                  Copy Code
                                </button>
                                <Highlight className={match[1]}>
                                  {codeContent}
                                </Highlight>
                              </div>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}>
                        {item.parts[0].text}
                      </Markdown>
                    </div>
                  </>
                ))}
          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
