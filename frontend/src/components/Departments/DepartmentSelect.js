   import DepartmentSelect from './components/Departments/DepartmentSelect';

   function SomeComponent() {
       const departmentId = 'some_id'; // Replace with actual ID or state

       return (
           <div>
               <DepartmentSelect departmentId={departmentId} />
           </div>
       );
   }

   export default SomeComponent;
   