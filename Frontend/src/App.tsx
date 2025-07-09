import EmployeeList from "../Components/EmployeeTable";
import { ModalsProvider } from '@mantine/modals';

import "../src/App.css"
function App() {
    return (
    <ModalsProvider> 
    <EmployeeList/>
    </ModalsProvider>
    )
}
export default App
