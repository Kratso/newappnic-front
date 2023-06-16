import { Container, Grid, Card, CardHeader, CardContent, Button } from "@mui/material"


const Perfil = () => {
    const logoutHandler = () => {
        localStorage.removeItem("TOKEN")

        window.location.reload()
    }

    return (
        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card
                        sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            backgroundColor: 'var(--color-bg-header-card)',
                        }}
                    >
                        <CardHeader title="Perfil" />
                        <CardContent>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" onClick={logoutHandler}>
                                    Logout
                                </Button>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Perfil