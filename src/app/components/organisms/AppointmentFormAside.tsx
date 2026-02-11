import RightFormVIsual from '../atoms/RightFormVIsual'

interface IAppointmentFormAsideProps{
  closeAside: ()=>void
}

const AppointmentFormAside:React.FC<IAppointmentFormAsideProps> = ({closeAside}) => {
  return (
    <RightFormVIsual closeAside={closeAside}>
      <h2 className='text-xl text-gray-600 font-semibold p-6'>Agendar Cita</h2>
      <div className='w-full border border-border'/>

      <div className='w-full p-6'>

      </div>
    </RightFormVIsual>
  )
}

export default AppointmentFormAside