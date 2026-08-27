interface ModalProProps {
    onClose: () => void;
}

function ModalPro({ onClose }: ModalProProps) {
    const handleAssinarPro = () => {
       

        
        console.log("Assinar Pro");
    };

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className="modal-box"
                onClick={(e) => e.stopPropagation()}
            >
                {/* FECHAR */}
                <button
                    className="modal-close"
                    onClick={onClose}
                    aria-label="Fechar"
                >
                    <i className="fas fa-times"></i>
                </button>

                {/* BADGE */}
                <div className="modal-badge">
                    PRO
                </div>

                {/* TÍTULO */}
                <h3 className="modal-title">
                    Recurso Exclusivo Pro
                </h3>

                {/* DESCRIÇÃO */}
                <p className="modal-text">
                    Esta funcionalidade está disponível
                    apenas para assinantes do plano Pro.
                </p>

                {/* ASSINAR */}
                <button
                    className="btn-pro-cta"
                    onClick={handleAssinarPro}
                    style={{
                        width: "100%",
                        marginTop: "1.5rem",
                    }}
                >
                    Assinar Agora &mdash; R$ 29,90/mês
                </button>

                {/* CANCELAR */}
                <button
                    className="btn-modal-cancel"
                    onClick={onClose}
                >
                    Talvez depois
                </button>
            </div>
        </div>
    );
}

export default ModalPro;