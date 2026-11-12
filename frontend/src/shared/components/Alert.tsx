interface AlertProps {
  type: 'error' | 'info';
  message: string;
}

export function Alert({ type, message }: AlertProps) {
  return (
    <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {message}
    </div>
  );
}
