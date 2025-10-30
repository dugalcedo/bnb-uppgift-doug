import './HomePage.css'

function HomePage() {
    return (
        <section className='page home-page'>
            <section id="heroes">

                <div className="hero" style={{ 
                    backgroundImage: "url(/hero/hero1.jpg)",
                    backgroundPosition: "0px -500px"
                }}>
                    <div className="inner responsive left" style={{
                        position: 'relative',
                        top: '180px',
                        backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.7), transparent)',
                        padding: '1rem',
                        borderRadius: '2rem'
                    }}>
                        <div className="title">
                            <p className='big'>
                                Be a part of something
                            </p>
                            <p className="cursive" style={{
                                position: "relative",
                                top: '-30px'
                            }}>
                                unsustainable
                            </p>
                        </div>
                        <div className="text">
                            <p>
                                Don't just be a bed and breakfast
                                <br />
                                Be <em>part of the problem</em>
                                <br />
                                <br />
                                Let us help you turn your property
                                <br />
                                into a <em>gentrification powerhouse</em>
                            </p>
                        </div>
                    </div>
                </div> {/* end of hero 1 */}

                <div className="hero" style={{
                    backgroundImage: 'url(/hero/hero2.jpg)',
                    backgroundSize: '100%',
                }}>
                    <div className="inner responsive" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'end',
                        textAlign: 'right',
                        position: 'relative',
                        top: '180px',
                        backgroundImage: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.7))',
                        padding: '1rem',
                        borderRadius: '2rem'
                    }}>
                        <div className="title">
                            <div className="cursive">
                                Home sweet
                            </div>
                            <div className="big" style={{
                                position: 'relative',
                                top: '-35px'
                            }}>
                                never-own
                            </div>
                        </div>
                        <div className="text">
                            <p>
                                With LandLord.ly,
                                <br />
                                you can <em>commodify</em> your home
                                <br />
                                and turn <strong>tenants</strong> into <strong>tourists</strong>
                            </p>
                        </div>
                    </div>
                </div> {/* end of hero 2 */}

                <div className="hero" style={{
                    backgroundImage: "url(/hero/hero3.jpg)",
                    backgroundSize: '100%',
                    textAlign: 'center'
                }}>
                    <div className="inner responsive" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        top: '200px',
                        backgroundImage: "linear-gradient(90deg, transparent, rgba(0,0,0,0.8), transparent)",
                        padding: '1rem'
                    }}>
                        <div className="title">
                            <div className="big">
                                It's like a hotel
                            </div>
                            <div className="cursive" style={{
                                position: 'relative',
                                top: '-30px'
                            }}>
                                but more expensive
                            </div>
                        </div>
                        <div className="text">
                            At a traditional hotel,
                            <br />
                            the cleaning fee is included 
                            <br />
                            in the price 🤔
                            <br />
                            <br />
                            <em><strong>Not with us 💖</strong></em>
                        </div>
                    </div>
                </div>

            </section>
        </section>
    )
}

export default HomePage;