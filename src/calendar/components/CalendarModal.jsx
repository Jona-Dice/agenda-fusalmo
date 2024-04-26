import { addHours, differenceInSeconds } from 'date-fns';
import { useMemo, useState } from 'react';
import Modal from 'react-modal';
import Datepicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
//import "./styles.css"
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import { es } from 'date-fns/locale/es';
import Swal from 'sweetalert2';
import { useUiStore } from '../../hooks/UseUiStore';
import { useEffect } from 'react';
import { useCalendarStore } from '../../hooks/useCalendarStore';

registerLocale('es', es)

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };


  Modal.setAppElement('#root'); //ayuda a que se pueda sobreponer ante todo

  export const  CalendarModal = () => {

    //const [ isOpen, setIsOpen ] = useState(true); Eliminar estado del modal
    //Estado desde nuestro custom hook
    const { isDateModalOpen, closeDateModal } = useUiStore();

    //extraer las dependencias que nos interesan a nosotros desde useCalendarStore
    const { activeEvent } = useCalendarStore();
    //extraer la funcion que inicia el proceso de grabación
    const { startSavingEvent } = useCalendarStore();

    const [ formSubmitted, setFormSubmitted ] = useState(false);

    const [ formValues, setFormValues] = useState ({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours (new Date(), 2)
    })
    //utilizamos el useMemo
    const titleClass = useMemo(() => {
        if ( !formSubmitted ) return '';

        return (formValues.title.length > 0 ) ? 'is-valid' : 'is-invalid'

    }, [ formValues.title, formSubmitted ])

    // crear useEffect
    useEffect( () => {
        if ( activeEvent !== null ) {
            setFormValues({ ...activeEvent })
        }
    }, [ activeEvent ] )


    const onInputChanged = ({ target }) => {
        setFormValues({
            ...formValues,
            [ target.name]: target.value
        })

    }

    const onDateChanged = (event, changing ) => {
        setFormValues({
            ...formValues,
            [ changing ]: event
        })
    }

    const oncloseModal = () => {
        //console.log('Cerrando el Modal...')
        closeDateModal();
    }
   
    const onSubmit = async (event) => {
        event.preventDefault(); // Corrección del typo aquí
        setFormSubmitted(true);
    
        const difference = differenceInSeconds(formValues.end, formValues.start);
        console.log({ difference });

        if (isNaN ( difference ) || difference <= 0 ) {
            Swal.fire({
                icon: 'error',
                title: 'Error en las fechas',
                text: 'La fecha de fin debe ser mayor a la fecha de inicio',
              });
            return;
        }
        if ( formValues.title.length <=0 ) {
            return;
        }

        console.log( formValues );

        await startSavingEvent( formValues );
        
        closeDateModal();

        setFormSubmitted(false);
    }


    return (
        <Modal
            isOpen={ isDateModalOpen }
            //onAfterOpen={afterOpenModal}
            onRequestClose={oncloseModal}
            style={customStyles}
            //contentLabel="Example Modal"
            
            className='modal' //asi se llama la clase en css
            overlayClassName='modal-fondo'
            closeTimeoutMS={ 500 }
        >
            <div style={{ textAlign: 'center' }}>
                <h2>Nuevo Evento</h2>
            </div>
            <hr />
            <form className='container' onSubmit={ onSubmit }>
                <div className='form-group mb-2'>
                    <label>Fecha y hora de inicio</label>&nbsp;
                    <Datepicker 
                     locale="es"
                     //minDate={ formValues.start }
                     selected={ formValues.start }
                     className='form-control'
                     onChange={ (event) => onDateChanged(event, 'start') }
                     showTimeSelect
                     dateFormat='Pp'
                     timeCaption='Hora'
                     />
                </div>
                <div className='form-group mb-2'>
                    <label>Fecha y hora de fin</label>&nbsp;
                    <Datepicker 
                     locale="es"
                     minDate={ formValues.start }
                     selected={ formValues.end }
                     className='form-control'
                     onChange={ (event) => onDateChanged(event, 'end') }
                     showTimeSelect
                     dateFormat='Pp'
                     timeCaption='Hora'
                     />
                </div>
                <hr />
                <div className='form-group mb-2'>
                    <label>Título y Notas</label>
                    <input  
                        type='text' 
                        className={`form-control ${ titleClass }` } 
                        placeholder='Título del evento'
                        name='title'

                        value={ formValues.title }
                        onChange={ onInputChanged }
                    />
                    <small className='form-text-muted'>Una breve descripción</small>
                </div>
                <div className='form-group mb-2'>
                    <textarea
                        type='text'
                        className='form-control'
                        placeholder='Notas'
                        rows='5'
                        name='notes' 
                        
                        value={ formValues.notes }
                        onChange={ onInputChanged }
                        >

                    </textarea>
                    <small className='form-text-muted'>Información adicional</small>
                </div>
                <button 
                type='submit'
                className='btn btn-outline-primary btn-block'>
                    <i className='far fa-save'></i>&nbsp;
                    <span>Guardar</span>
                </button>
            </form>
            
        </Modal>
    )
  }