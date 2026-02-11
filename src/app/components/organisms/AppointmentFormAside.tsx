import RightFormVIsual from '../atoms/RightFormVIsual'
import { AppointmentForm } from './Forms/AppointmentForm'

interface IAppointmentFormAsideProps{
  closeAside: ()=>void
}

const AppointmentFormAside:React.FC<IAppointmentFormAsideProps> = ({closeAside}) => {
  return (
    <RightFormVIsual closeAside={closeAside}>
      <h2 className='text-xl text-gray-600 font-semibold p-6'>Agendar nueva cita</h2>
      <div className='w-full border border-border'/>

      <div className='w-full h-full'>
        <AppointmentForm closeAside={closeAside}/>
      </div>
    </RightFormVIsual>
  )
}

export default AppointmentFormAside