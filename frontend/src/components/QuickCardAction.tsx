import { Card, CardContent } from "./ui/card.js";
interface QuickActionProps {
    icon: React.ReactNode;
    label: string;
    bgColor: string;
    borderColor: string;
    onClick: () => void;
}


const QuickActionCard = ({ icon, label, bgColor, borderColor, onClick }: QuickActionProps) => (
    <Card 
        onClick={onClick}
        className={`cursor-pointer hover:shadow-md transition-all active:scale-95 border ${borderColor}`}
    >
        <CardContent className="p-4 flex flex-col items-center justify-center gap-3 h-32">
            <div className={`p-3 rounded-full ${bgColor}`}>
                {icon}
            </div>
            <span className="text-sm font-medium text-gray-700 text-center">{label}</span>
        </CardContent>
    </Card>
);

export default QuickActionCard