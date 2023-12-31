export default function Footer(): JSX.Element {

    const year = new Date().getFullYear();

    return (
        <div className="Footer">
            <h5>&copy; <a href="https://www.newdata.org/" target="_blank">Center for New Data</a> {year}</h5>
        </div>
    )
}
