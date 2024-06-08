import { useRef } from "react";

export default function ForgotPassword() {
  const emailRef = useRef()
  const email =emailRef.current?.value; 
  if (email) {
            alert(`Email: ${email}`);
        } else {
            alert(`Email sent.`)
        }

    
    return(
    <>
   <form className="row g-3">
    <div className="col-auto">
      <label htmlFor="inputPassword2" className="visually-hidden">Email</label>
      <input type="email" className="form-control" id="inputemail2" placeholder="email"></input>
    </div>
    <div className="col-auto">
      <button type="submit" className="btn btn-primary mb-3">send to email</button>
    </div>
  </form>
    </> //remember connect all buttons to each other (sign up page)
    )
}