import { useState, useEffect, useRef } from "react"
import ClienteService from "../services/clienteService"
import TicketService from "../services/ticketService"
import RespuestaService from "../services/respuestaService"
import NotificacionService from "../services/notificacionService"
import EmailService from "../services/emailService"
import "../css/ChatModal.css"

export default function ChatModal({ onClose }) {
  const [messages, setMessages] = useState([
    { from: "skill", text: "Hola. Soy tu asistente. Selecciona una opcion:" }
  ])
  const [input, setInput] = useState("")
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    tipo: "",
    cedula: "",
    clienteData: null,
    ticketId: null
  })
  const pollingRef = useRef(null)

  const menuOptions = {
    1: "Estado de servicios contratados",
    2: "Cambiar nombre de red",
    3: "Cambiar clave WiFi",
    4: "Reportar falla o lentitud",
    5: "Productos adicionales",
    6: "Reclamo",
    7: "Facturacion",
    8: "Ir al menu principal"
  }

  const categoriaAgenteMap = {
    "estado de servicios contratados": null,
    "cambiar nombre de red": "SOPORTE_TECNICO",
    "cambiar clave wifi": "SOPORTE_TECNICO",
    "reportar falla o lentitud": "SOPORTE_TECNICO",
    "productos adicionales": "CONSULTA",
    "reclamo": "RECLAMO",
    "facturacion": "FACTURACION"
  }

  const mostrarEstadoPlan = (cliente) => {
    if (!cliente || !cliente.servicios || cliente.servicios.length === 0)
      return "No se encontraron servicios activos para tu cuenta"
    return cliente.servicios.map((s,i)=>`${i+1}. ${s.tipo}: ${s.detalle}`).join("\n")
  }

  const startPolling = (ticketId) => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    pollingRef.current = setInterval(async () => {
      const res = await RespuestaService.obtenerRespuestas(ticketId).catch(() => [])
      setMessages(prev => {
        const existingIds = prev.map(m => m.id)
        const nuevos = res.filter(r => !existingIds.includes(r.id))
        return [...prev, ...nuevos.map(r=>({from: r.from==='AGENTE'?'agent':'user', text: r.text, id: r.id}))]
      })
    }, 2000)
  }

  const notificarCliente = async (cliente, mensaje) => {
    try {
      if (!cliente) return

      if (NotificacionService && cliente.id_cliente) {
        await NotificacionService.crear({
          idCliente: cliente.id_cliente,
          mensaje,
          emailDestinatario: cliente.email
        })
      }

      if (EmailService && cliente.email) {
        await EmailService.enviar({
          destinatario: cliente.email,
          asunto: "Informacion del sistema",
          mensaje
        })
      }
    } catch (err) {
      console.error("Error enviando notificacion o email:", err)
    }
  }

  const handleOptionClick = (option) => {
    setFormData({...formData, tipo: option})
    setMessages(prev => [
      ...prev,
      {from:"skill", text:"Ingresa tu numero de cedula, RUC o pasaporte:"}
    ])
    setStep(1)
  }

  const handleSend = async () => {
    if (!input || loading) return
    setLoading(true)

    setMessages(prev => [...prev, {from:"user", text: input}])
    const texto = input
    setInput("")

    try {
      switch(step){
        case 1:
          const clienteResp = await ClienteService.obtenerCliente(texto).catch(()=>null)
          if(clienteResp && clienteResp.data){
            setFormData({...formData, cedula: texto, clienteData: clienteResp.data})
            setMessages(prev => [
              ...prev,
              {from:"skill", text:`Cliente encontrado. Hola ${clienteResp.data.nombre} ${clienteResp.data.apellido}`},
              {from:"skill", text: Object.entries(menuOptions).map(([k,v])=>`${k} ${v}`).join("\n")}
            ])
            setStep(2)
          } else {
            setMessages(prev => [...prev, {from:"skill", text:"No se encontro cliente con esa cedula"}])
          }
          break

        case 2:
          const opcionInput = texto.toLowerCase()
          if(opcionInput==="8" || opcionInput==="ir al menu principal"){
            setMessages(prev => [...prev, {from:"skill", text:"Regresando al menu principal"}])
            setStep(0)
            break
          }

          const categoria = categoriaAgenteMap[opcionInput] || "SOPORTE_TECNICO"
          if(!formData.clienteData){
            setMessages(prev => [...prev, {from:"skill", text:"No se pudo crear ticket sin cliente"}])
            break
          }

          let descripcion = ""
          switch(opcionInput){
            case "1": case "estado de servicios contratados":
              descripcion = mostrarEstadoPlan(formData.clienteData)
              setMessages(prev => [...prev, {from:"skill", text:`Tus servicios activos:\n${descripcion}`}])
              break
            default:
              descripcion = `Desde chat: ${menuOptions[opcionInput] || opcionInput}`
              const ticket = {
                idCliente: formData.clienteData.id_cliente,
                categoria,
                descripcion,
                prioridad:"MEDIA"
              }
              const ticketResp = await TicketService.crearTicket(ticket).catch(()=>null)
              if(ticketResp){ // no uses ticketResp.data
              setFormData(prev => ({...prev, ticketId: ticketResp.idTicket}))
              setMessages(prev => [...prev, {from:"skill", text:`Ticket creado con ID ${ticketResp.idTicket}. Ahora puedes chatear con un agente.`}])
               await notificarCliente(formData.clienteData, `Se ha creado un ticket con ID ${ticketResp.idTicket}`)
                 startPolling(ticketResp.idTicket)
                 setStep(3)
                } else {
                  setMessages(prev => [...prev, {from:"skill", text:"Error creando ticket"}])
                }

          }
          break

        case 3:
          if(!formData.ticketId){
            setMessages(prev => [...prev, {from:"skill", text:"No se identifico ticket para enviar mensaje"}])
            break
          }
          await RespuestaService.enviarRespuesta(formData.ticketId, texto).catch(()=>null)
          break

        default:
          setMessages(prev => [...prev, {from:"skill", text:"Gracias por contactarnos"}])
      }
    } catch(err){
      console.error(err)
      setMessages(prev => [...prev, {from:"skill", text:"Ocurrio un error, intenta mas tarde"}])
    }

    setLoading(false)
  }

  useEffect(()=>{ return ()=>{ if(pollingRef.current) clearInterval(pollingRef.current) } }, [])

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        <div className="chat-header">
          Chat
          <button className="chat-close-btn" onClick={onClose}>x</button>
        </div>

        <div className="chat-messages">
          {messages.map((m,i)=>(
            <div key={i} className={`chat-message ${m.from==='user'?'user':m.from==='agent'?'bot':'skill'}`}>
              {m.text}
            </div>
          ))}

          {step===0 && (
            <div className="chat-options-container">
              {["Atencion al cliente","Contratar un servicio"].map((opt,i)=>(
                <button key={i} className="chat-option-button" onClick={()=>handleOptionClick(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {step>0 && (
          <div className="chat-input-container">
            <input
              className="chat-input"
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleSend()}
              placeholder="Escribe un mensaje"
            />
            <button className="chat-send-btn" onClick={handleSend} disabled={loading}>
              {loading? "Enviando...":"Enviar"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
