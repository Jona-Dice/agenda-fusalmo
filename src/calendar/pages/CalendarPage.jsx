import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
//import { addHours } from 'date-fns';
import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, Navbar } from "../";
import { localizer, getMessagesES } from '../../helpers';
import { useState } from 'react';
import { useUiStore } from '../../hooks/UseUiStore';
import { useCalendarStore } from '../../hooks/useCalendarStore';


/*const events = [{
    title: 'Cumpleaños del Team Leader',
    notes: 'Comprar una taza de Batman',
    start: new Date(),
    end: addHours(new Date(), 2),
    bgColor: '#fafafa',
    user: {
        _id: '123',
        name: 'Jonathan'

    }
}]*/

export const CalendarPage = () => {

     const { openDateModal } = useUiStore();
     const { closeDateModal } = useUiStore();
     
     const { events, setActiveEvent } = useCalendarStore();

    const [lastView, setLastView ] = useState(localStorage.getItem('lastView') || 'agenda');
    //const dispatch = useDispatch();

    const eventStyleGetter = (event, start, end, isSelected ) => {

        const style = {
            backgroundColor: '#527375',
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white'
        }
        return {
            style
        }
    }

    const onDoubleClick = (event) => {
        //console.log({ doubleClick: event }) Eliminar
        openDateModal();
    }

    const onSelect = (event) => {
       //console.log({ click: event })
      //closeDateModal();
      setActiveEvent( event );
      
    }

    const onViewChange = (event) => {
        localStorage.setItem('lastView', event);
        setLastView(event);
    }



    return (
        <>
         <Navbar /> 
         <Calendar
          culture='es'
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'calc( 100vh - 80px )' }}
          messages={ getMessagesES() }
          eventPropGetter={ eventStyleGetter }
          components={{ 
            event: CalendarEvent
          }}

          //colocar los eventos acá
          onDoubleClickEvent={ onDoubleClick }
          onSelectEvent={ onSelect }
          onView={ onViewChange }

          defaultView={ lastView }
         />  
         <CalendarModal />
         <FabAddNew />
         <FabDelete />
        </>
    )
}