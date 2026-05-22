import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useStore from '../store';

const THEME = {
  primary: '#10b981', // 翡翠绿 (User 气泡)
  botBg: '#f3f4f6', // 浅灰 (Bot 气泡)
  botText: '#1f2937',
  userText: '#ffffff',
  border: '#e5e7eb',
  bg: '#fafafa',
  codeBg: '#eaebed', // 代码块浅灰底色
};

const ChatComponent: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const messages = useStore((state) => state.messages);
  const threadId = useStore((state) => state.threadId);
  const addMessage = useStore((state) => state.addMessage);
  const updateLastMessage = useStore((state) => state.updateLastMessage);

  const eventSourceRef = useRef<EventSource | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 视觉优化：新消息到来时自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleUserInput(input: string) {
    addMessage(input, 'user');
    addMessage('', 'Bot');

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource(
      `http://localhost:3001/api/messages/stream?text=${encodeURIComponent(input)}&threadId=${threadId}`
    );
    eventSourceRef.current = es;
    let fullText = '';

    es.onmessage = (event) => {
      if (event.data === '[DONE]') {
        es.close();
        return;
      }
      try {
        const data = JSON.parse(event.data);
        const chunk = data.delta ?? '';
        fullText += chunk;
        updateLastMessage(fullText);
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    };

    es.onerror = (err) => {
      console.error('SSE error:', err);
      es.close();
    };
  }

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    handleUserInput(inputValue);
    setInputValue('');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '600px', // 🛠️ 整个组件固定 400px 宽
        margin: '0 auto',
        backgroundColor: THEME.bg,
        borderLeft: `1px solid ${THEME.border}`,
        borderRight: `1px solid ${THEME.border}`,
        boxSizing: 'border-box', // 确保边框不撑大容器
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 🛠️ 注入纯内联动画样式，不破坏组件结构 */}
      <style>{`
        @keyframes chatBotDotBlink {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      {/* 顶部 Header：增加专业感 */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${THEME.border}`,
          backgroundColor: '#fff',
          fontWeight: 600,
          fontSize: '15px',
          color: '#111827',
        }}
      >
        🤖 AI Assistant
      </div>

      {/* 聊天内容区域：使用 Flexbox 代替 float */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px', // 气泡之间的间距
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {messages.map((message, index) => {
          const isUser = message.sender === 'user';
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start', // 🛠️ User 靠右，Bot 靠左
                maxWidth: '90%', // 窄屏下适当加大最大宽度
                alignSelf: isUser ? 'flex-end' : 'flex-start', // 🛠️ User 靠右，Bot 靠左
              }}
            >
              {/* 角色标签 */}
              <div
                style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  marginBottom: '4px',
                  padding: '0 4px',
                }}
              >
                {isUser ? 'You' : 'Assistant'}
              </div>

              {/* 聊天气泡 */}
              <div
                style={{
                  padding: '10px 14px', // 窄屏微调
                  borderRadius: isUser
                    ? '16px 16px 2px 16px'
                    : '16px 16px 16px 2px', // 现代不对称圆角
                  backgroundColor: isUser ? THEME.primary : THEME.botBg,
                  color: isUser ? THEME.userText : THEME.botText,
                  fontSize: '14px', // 窄屏微调
                  lineHeight: '1.5',
                  wordBreak: 'break-word', // 防止长文本撑破布局
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  border: isUser ? 'none' : `1px solid ${THEME.border}`,
                  textAlign: 'left',
                }}
              >
                {!message.text ? (
                  /* 🛠️ 将原有的文本“思考中...”替换为高质感的跳动三圆点动画 */
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 2px',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#9ca3af',
                        borderRadius: '50%',
                        display: 'inline-block',
                        animation: 'chatBotDotBlink 1.4s infinite both',
                      }}
                    />
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#9ca3af',
                        borderRadius: '50%',
                        display: 'inline-block',
                        animation: 'chatBotDotBlink 1.4s infinite both 0.2s',
                      }}
                    />
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#9ca3af',
                        borderRadius: '50%',
                        display: 'inline-block',
                        animation: 'chatBotDotBlink 1.4s infinite both 0.4s',
                      }}
                    />
                  </div>
                ) : isUser ? (
                  // 用户消息保留基础换行
                  <span style={{ whiteSpace: 'pre-wrap' }}>{message.text}</span>
                ) : (
                  // AI 消息采用 Markdown 渲染
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // 1. 段落间距微调
                      p: ({ children }) => (
                        <p style={{ margin: '0 0 6px 0' }}>{children}</p>
                      ),
                      // 2. 列表样式复位
                      ul: ({ children }) => (
                        <ul
                          style={{ paddingLeft: '20px', margin: '0 0 6px 0' }}
                        >
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol
                          style={{ paddingLeft: '20px', margin: '0 0 6px 0' }}
                        >
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li style={{ marginBottom: '2px' }}>{children}</li>
                      ),
                      // 3. 行内代码与代码块定制
                      code: ({ inline, children, ...props }) => {
                        return inline ? (
                          <code
                            style={{
                              backgroundColor: THEME.codeBg,
                              padding: '2px 4px',
                              borderRadius: '4px',
                              fontSize: '13px',
                              fontFamily: 'monospace',
                            }}
                            {...props}
                          >
                            {children}
                          </code>
                        ) : (
                          <pre
                            style={{
                              backgroundColor: THEME.codeBg,
                              padding: '8px',
                              borderRadius: '8px',
                              overflowX: 'auto',
                              margin: '6px 0',
                            }}
                          >
                            <code
                              style={{
                                fontSize: '12px',
                                fontFamily: 'monospace',
                                color: '#24292e',
                              }}
                              {...props}
                            >
                              {children}
                            </code>
                          </pre>
                        );
                      },
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部输入框区域 */}
      <div
        style={{
          padding: '12px 16px', // 窄屏微调
          backgroundColor: '#fff',
          borderTop: `1px solid ${THEME.border}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f9fafb',
            border: `1px solid ${THEME.border}`,
            borderRadius: '24px', // 圆角输入框
            padding: '2px 4px 2px 12px', // 窄屏微调
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="问点什么吧..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              padding: '8px 0',
              fontSize: '14px', // 窄屏微调
              color: '#111827',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              backgroundColor: THEME.primary,
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              padding: '6px 14px', // 窄屏微调
              fontSize: '13px', // 窄屏微调
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
