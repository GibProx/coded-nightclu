const ContactPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Contact Us</h1>
      <p className="mb-5">We'd love to hear from you! Please use the information below to get in touch.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-3">General Inquiries</h2>
          <p>Email: info@coded.com</p>
          <p>Phone: +44 123 123 1234</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Address</h2>
          <p>
            90 Hospital Street
            <br />
            Birmingham, B19 3QP, United Kingdom
          </p>
        </div>
      </div>

    </div>
  )
}

export default ContactPage
