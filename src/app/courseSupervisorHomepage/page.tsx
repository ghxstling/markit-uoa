import Sidebar from "../components/Sidebar"
import StarIcon from '@mui/icons-material/Star';

export default function CSHomepage(){
    return(
        <div>
            <div>
                <Sidebar></Sidebar>
            </div>
            <div style={{
                paddingLeft: 250
                }}>
                <div style={{display:"inline-flex"}}>
                <StarIcon></StarIcon>
                <p>Dashboard</p>
                </div>
                <h1>Welcome, Supervisor</h1>
            </div>
        </div>
    )
}