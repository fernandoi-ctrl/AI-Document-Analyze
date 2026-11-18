//@ts-ignore
import './error.css';
type ErrorScreenProps = {
  message: string
}
export function ErrorScreen({ message }: ErrorScreenProps) {
  return <><div className="error-screen">
    <h1>😔 Ocurrió un error</h1>
    <p>Lo sentimos, no pudimos procesar tu solicitud.</p>
    <p>Mensaje: {message}</p>
    <button onClick={e => window.location.reload()}>Reintentar</button>
  </div>
  </>
}