import { motion } from 'framer-motion'

export const WelcomeAnimation = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="p-1 mb-2"
        >
            <div className="flex items-center gap-2">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="text-2xl"
                >
                    👋
                </motion.div>
            </div>
        </motion.div>
    )
}

export default WelcomeAnimation
