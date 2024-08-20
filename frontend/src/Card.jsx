

function Card(props) {
    return (
        <div className="image-container">
            <img src={`data:image/png;base64,${props.img}`} />
            <button onClick={() => props.onClickHandler(props.img)}>Mint</button>
        </div>
    )
}

export default Card