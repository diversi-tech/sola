export const EmployeeRow = ({ employee, rating, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="w-full flex items-center justify-between py-2.5 px-5 mb-2 cursor-pointer transition-all duration-250 group"
      style={{
        direction: 'rtl',
        background: '#EFF6FF',
        border: '1px solid #BFDBFE',
        borderLeft: '4px solid #2563EB',
        borderRadius: '10px',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = '#DBEAFE';
        e.currentTarget.style.borderLeftColor = '#1D4ED8';
        e.currentTarget.style.transform = 'translateX(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = '#EFF6FF';
        e.currentTarget.style.borderLeftColor = '#2563EB';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
          style={{
            background: 'linear-gradient(135deg, #2563EB, #0EA5E9)',
            border: '2px solid #BFDBFE',
          }}
        >
          {employee.name ? employee.name.charAt(0) : '?'}
        </div>

        <div className="flex items-center gap-2.5">
          <h3
            className="text-base font-medium transition-colors duration-200"
            style={{ color: '#1E3A5F' }}
          >
            {employee.name}
          </h3>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={
              employee.is_active
                ? { background: '#DBEAFE', color: '#1D4ED8', border: '1px solid #BFDBFE' }
                : { background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0' }
            }
          >
            {employee.is_active ? 'פעיל' : 'לא פעיל'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-0.5 shrink-0">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={index < rating ? '#F59E0B' : '#BFDBFE'}
          >
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z"/>
          </svg>
        ))}
      </div>
    </div>
  );
};