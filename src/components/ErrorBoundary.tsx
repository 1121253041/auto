import { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * 全局错误边界组件
 * 捕获子组件树中的JavaScript错误，显示友好的错误界面
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error, errorInfo: ErrorInfo) {
    return {
      hasError: true,
      error,
      errorInfo,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误到控制台
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // 可以在这里将错误日志发送到错误报告服务
    // logErrorToService(error, errorInfo)

    this.setState({
      hasError: true,
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#fff',
          borderRadius: '8px',
          maxWidth: '600px',
          margin: '40px auto',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
          <h1 style={{ color: '#f44336', marginBottom: '16px' }}>
            出错了
          </h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            应用遇到了一个错误。请尝试刷新页面或重置应用。
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details style={{
              textAlign: 'left',
              backgroundColor: '#f5f5f5',
              padding: '16px',
              borderRadius: '4px',
              marginBottom: '16px',
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                错误详情
              </summary>
              <pre style={{
                fontSize: '12px',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
              }}>
                {this.state.error?.toString()}
                {'\n\n'}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              重置
            </button>
            <button
              onClick={this.handleReload}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              刷新页面
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}