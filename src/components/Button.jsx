const Button = ({ onClick = null, children = null }) => {
    return (
        <button className="rounded-md bg-blue-600 text-white p-2" onClick={onClick}>{children}</button>
    )

}

export default Button