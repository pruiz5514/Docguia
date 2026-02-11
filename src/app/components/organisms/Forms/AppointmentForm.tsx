import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Form from '../../atoms/Form';
import ComboboxForm from '../../atoms/ComboboxForm';
import { IPostAppointment } from '@/app/core/application/dto/appointments/post-appointment.dto';
import SelectForm from '../../atoms/SelectForm';
import FormInput from '../../atoms/FormInput';
import { PlusIcon } from 'lucide-react';
import TrasnparentButton from '../../atoms/Buttons/TransparentButton';
import MainButton from '../../atoms/Buttons/MainButton';

interface IAppointmentFormProps{
  closeAside?: ()=>void;
}

export const AppointmentForm:React.FC<IAppointmentFormProps> = ({closeAside}) => {
  const schema: yup.ObjectSchema<IPostAppointment> = yup.object({
    patient: yup.number().required('Campo requerido'),
    office: yup.number().required('Campo requerido'),
    date: yup.date().required('Campo requerido'),
    time: yup.number().required('Campo requerido'),
    services: yup.string().required('Campo requerido'),
    duration: yup.number().required('Campo requerido'),
  });

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm<IPostAppointment>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
        duration: 30,
    },
  });

  const handleCreate = async(data: IPostAppointment) => {
    setLoading(true)
    try {
      reset();
      if(closeAside){
        closeAside()
      }

    } catch(e) {
      console.log(e)
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit(handleCreate)} id='login-form'>
      <section className='flex flex-col h-[calc(100vh-80px)]'>
        <div className='p-6 flex flex-col gap-6'>

            <ComboboxForm<IPostAppointment>
                label="Paciente"
                madatory
                name="patient"
                placeholder='Buscar paciente'
                control={control}
                error={errors.patient}
                isSubmitted={isSubmitted}
                options={[
                    { value: 1, label: 'Juan Perez' },
                    { value: 2, label: 'Santiago Ramirez' },
                    { value: 3, label: 'Ana Rivas' },
                ]}
            />

            <SelectForm<IPostAppointment>
                name="office"
                madatory
                label='Consultorio'
                placeholder='Selecciona un consultorio'
                error={errors.office}
                options={[
                    { value: 1, label: 'Juan Perez' },
                    { value: 2, label: 'Santiago Ramirez' },
                    { value: 3, label: 'Ana Rivas' },
                ]}
                control={control}
                vertical
                isSubmitted={isSubmitted}
            />

            <div className='w-full flex gap-2'>

                <div className='w-full'>
                    <FormInput<IPostAppointment>
                        type="date"
                        mandatory
                        label='Fecha'
                        name="date"
                        placeholder="Selecciona una fecha"
                        error={errors.date}
                        control={control}
                        isSubmitted={isSubmitted}
                    />
                </div>
                
                <div className='w-full'>
                    <FormInput<IPostAppointment>
                        type="time"
                        mandatory
                        label='Hora'
                        name="time"
                        placeholder="Hora"
                        error={errors.time}
                        control={control}
                        isSubmitted={isSubmitted}
                    />
                </div>
            </div>

            <FormInput<IPostAppointment>
                type="number"
                mandatory
                label='Duración de la cita (min)'
                name="duration"
                placeholder="duration"
                error={errors.duration}
                control={control}
                isSubmitted={isSubmitted}
            />



            <SelectForm<IPostAppointment>
                name="services"
                madatory
                label='Consultorio'
                placeholder='Selecciona un consultorio'
                error={errors.services}
                options={[
                    { value: 1, label: 'Juan Perez' },
                    { value: 2, label: 'Santiago Ramirez' },
                    { value: 3, label: 'Ana Rivas' },
                ]}
                control={control}
                vertical
                isSubmitted={isSubmitted}
            />
            
            <div className='w-full flex flex-col gap-4'>
                <button className='flex text-sm font-medium text-purple-800 items-center gap-2'>Añadir notas internas <PlusIcon className='w-4 h-4'/></button>
                <button className='flex text-sm font-medium text-purple-800 items-center gap-2'>Añadir Motivo de consulta <PlusIcon className='w-4 h-4'/></button>
            </div>
        </div>


        <div className='w-full border-t-2 border-border p-6 flex gap-4 mt-auto'>
            <TrasnparentButton onClick={closeAside} width='w-full'>Cancelar</TrasnparentButton>
            <MainButton width='w-full' type='submit'>Agendar cita</MainButton>
        </div>
      </section>
      
    </Form>
  )
}