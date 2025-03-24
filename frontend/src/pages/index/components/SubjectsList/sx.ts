const useSx = () => ({
  skeletonCard: {
    borderRadius: 2,
    overflow: "hidden",
    boxShadow: 2,
  },
  skeletonBox: {
    bgcolor: "grey.300",
    height: 60,
  },
  skeletonBox2: {
    display: "flex",
    justifyContent: "center",
    gap: 1,
    mt: 1,
  },
  gridMain: {
    mt: 3,
  },
  typographyMain: {
    mb: 2,
  },
  cardMain: {
    borderRadius: 2,
    overflow: "hidden",
    boxShadow: 2,
    textAlign: "center",
  },
  boxMain: {
    bgcolor: "primary.main",
    color: "white",
    p: 2,
  },
  typographySubjectMain: {
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  box2Main: {
    display: "flex",
    justifyContent: "center",
    gap: 1,
    mt: 1,
  },
  asistenciaButtonMain: {
    textTransform: "none",
    fontSize: "0.85rem",
    px: 2,
    py: 1,
    borderRadius: 2,
    color: "#00B26A",
    borderColor: "#00B26A",
  },
  calificacionesButtonMain: {
    textTransform: "none",
    fontSize: "0.85rem",
    px: 2,
    py: 1,
    borderRadius: 2,
    color: "#FF5200",
    borderColor: "#FF5200",
  },
});

export default useSx;
