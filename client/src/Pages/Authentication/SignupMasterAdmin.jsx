import { useState } from "react"
import { supabase } from "../../supabaseClient"
import { useNavigate } from "react-router-dom"

const SignupMasterAdmin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [orgName, setOrgName] = useState("")
  const navigate = useNavigate()
  const [status, setStatus] = useState("")

  const handleSignup = async (e) => {
    e.preventDefault()
    setStatus("Creating account...")

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) return setStatus("Signup failed: " + error.message)

    const user = data.user
    if (!user) return setStatus("Signup failed: No user returned")

    // Insert into `users` table
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: user.id,
        full_name: fullName,
        email,
        role: "master_admin",
        organization_name: orgName,
        signup_type: "new_org",
        created_at: new Date().toISOString(),
      },
    ])

    if (insertError) return setStatus("Insert error: " + insertError.message)

    setStatus("Master Admin created! Redirecting to login...")
    setTimeout(() => navigate("/login"), 2000)
  }

  return (
    <form onSubmit={handleSignup} className="p-8">
      <h2>Master Admin Signup (One-Time)</h2>
      <input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
      <input placeholder="Organization Name" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
      <button type="submit">Create Master Admin</button>
      <p>{status}</p>
    </form>
  )
}
export default SignupMasterAdmin
