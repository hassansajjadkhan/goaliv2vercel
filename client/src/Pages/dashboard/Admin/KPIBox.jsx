const KPIBox = ({ title, value }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
    </div>
  )
}

export default KPIBox
