import { NavLink } from "react-router-dom"
export default function ForgotPassword() {
  {
    alert(`Sent.`)
}
    return(
    <>
   <form className="row g-3">
    <div className="col-auto">
      <label htmlFor="inputPassword2" className="visually-hidden">Email</label>
      <input type="email" className="form-control" id="inputemail2" placeholder="email"></input>
    </div>
    <div className="col-auto">
    <NavLink to={'/login'} >
      <button type="submit" className="btn btn-primary mb-3">send to email</button>
      </NavLink>
    </div>
  </form>
    </> //remember connect all buttons to each other (sign up page)
    )
}