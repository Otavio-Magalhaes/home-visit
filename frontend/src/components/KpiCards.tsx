const KpiCard = ({ label, value, loading, color }: any) => (
    <div className={`bg-white rounded-lg shadow-sm p-5 border-l-4 ${color}`}>
        <dt className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</dt>
        <dd className="mt-1 text-2xl font-bold text-gray-800">
            {loading ? "..." : (value || 0)}
        </dd>
    </div>
);

export default KpiCard;