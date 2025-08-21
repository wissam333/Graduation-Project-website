

function topBarLoggedIn() {

    const handleonLogOut = async () => {
        await logOut()
    }
    return (
        <div className="top-bar-logged-in">
            <button onClick={handleonLogOut}>Log out</button>
        </div>
    )
}
export default topBarLoggedIn