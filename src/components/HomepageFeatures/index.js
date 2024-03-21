import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
    {
        title: 'Easy Tests',
        Svg: require('@site/static/img/managed_tests.svg').default,
        description: (
            <>
                Run our managed tests out-of-the-box. No need to configure anything!
            </>
        ),
    },
    {
        title: 'Integrated Tests',
        Svg: require('@site/static/img/integrated_e2e.svg').default,
        description: (
            <>
                Integrate the end-to-end tests of other plugins to keep track of compatibility,
                and upload your own to contribute to the ecosystem.
            </>
        ),
    },
    {
        title: 'Get fancy with our Local Test Environment',
        Svg: require('@site/static/img/local_environment.svg').default,
        description: (
            <>
                Configurable, disposable environment, engineered to do one thing well: Run tests on your local machine or on CI.
            </>
        ),
    },
];

function Feature({Svg, title, description}) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <Svg className={styles.featureSvg} role="img" />
            </div>
            <div className="text--center padding-horiz--md">
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures() {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
