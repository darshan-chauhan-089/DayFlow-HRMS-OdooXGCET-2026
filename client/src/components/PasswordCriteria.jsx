import { FaCheck, FaCircle, FaRuler, FaFont, FaSortAlphaDown, FaSortNumericDown, FaStar } from 'react-icons/fa';

const PasswordCriteria = ({ password }) => {
    const criteria = [
        {
            label: 'At least 6 characters',
            test: (pwd) => pwd.length >= 6,
            icon: FaRuler,
        },
        {
            label: 'Contains uppercase letter',
            test: (pwd) => /[A-Z]/.test(pwd),
            icon: FaFont,
        },
        {
            label: 'Contains lowercase letter',
            test: (pwd) => /[a-z]/.test(pwd),
            icon: FaSortAlphaDown,
        },
        {
            label: 'Contains a number',
            test: (pwd) => /[0-9]/.test(pwd),
            icon: FaSortNumericDown,
        },
        {
            label: 'Contains special character',
            test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
            icon: FaStar,
        },
    ];

    const getStrength = () => {
        const passed = criteria.filter((c) => c.test(password)).length;
        if (passed === 0) return { label: 'Very Weak', color: 'bg-gray-300', width: '0%' };
        if (passed <= 2) return { label: 'Weak', color: 'bg-red-500', width: '20%' };
        if (passed === 3) return { label: 'Fair', color: 'bg-orange-500', width: '50%' };
        if (passed === 4) return { label: 'Good', color: 'bg-yellow-500', width: '75%' };
        return { label: 'Strong', color: 'bg-green-500', width: '100%' };
    };

    const strength = getStrength();

    if (!password) return null;

    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Password Strength</span>
                    <span className={`text-xs font-bold ${strength.color === 'bg-green-500' ? 'text-green-600' :
                            strength.color === 'bg-yellow-500' ? 'text-yellow-600' :
                                strength.color === 'bg-orange-500' ? 'text-orange-600' :
                                    strength.color === 'bg-red-500' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                        {strength.label}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                        className={`${strength.color} h-full transition-all duration-300 ease-out rounded-full`}
                        style={{ width: strength.width }}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600 mb-2">Password Requirements:</p>
                {criteria.map((criterion, index) => {
                    const isPassed = criterion.test(password);
                    return (
                        <div
                            key={index}
                            className={`flex items-center gap-2 text-sm transition-all duration-200 ${isPassed ? 'text-green-600' : 'text-gray-500'
                                }`}
                        >
                            <span className="flex-shrink-0">
                                {isPassed ? (
                                    <span className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
                                        <FaCheck className="text-green-600 text-xs" />
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center w-5 h-5 bg-gray-200 rounded-full">
                                        <FaCircle className="text-gray-400 text-xs" />
                                    </span>
                                )}
                            </span>
                            <span className={`flex items-center gap-2 ${isPassed ? 'font-medium' : ''}`}>
                                <criterion.icon className="text-sm" />
                                {criterion.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PasswordCriteria;
