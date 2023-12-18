import { NavLink } from "react-router-dom";

/**
 * Menu Navigation bar to navigate to different parts of the project
 * @returns 
 */
export function PageNavigation(): JSX.Element {
    return (
        <div className="Navigation">
            <div className="Navigation_branding">
                <h1><NavLink to="/">Equitable Polling Locations</NavLink></h1>
            </div>
            <div className="Navigation_links">
                <NavLink to="/Map" className={({ isActive }) => (isActive ? 'active' : 'inactive')}><h3>Map</h3></NavLink>
                <NavLink to="/Trends" className={({ isActive }) => (isActive ? 'active' : 'inactive')}><h3>Trends</h3></NavLink>
            </div>
        </div>
    )
}

export function MainNavigation(): JSX.Element {
    return (
        <div className="Navigation">
            <div className="Navigation_branding">
                <h1><NavLink to="/">Equitable Polling Locations</NavLink></h1>
            </div>
            <div className="Navigation_links">
                <NavLink to="/Methodology" className={({ isActive }) => (isActive ? 'active' : 'inactive')}><h3>Methodology</h3></NavLink>
                <NavLink to="/About" className={({ isActive }) => (isActive ? 'active' : 'inactive')}><h3>About</h3></NavLink>
            </div>
        </div>
    )
}
