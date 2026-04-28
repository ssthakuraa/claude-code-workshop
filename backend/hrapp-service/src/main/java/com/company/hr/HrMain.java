package com.company.hr;

import com.company.hr.common.log.HrLogHelper;
import com.company.hr.config.HrRuntimeConfig;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;

/**
 * Jersey-era entry point for the rewrite foundation.
 */
public final class HrMain {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrMain.class);

    private HrMain() {
    }

    public static void main(String[] args) throws Exception {
        HrRuntimeConfig runtimeConfig = HrRuntimeConfig.fromEnvironment();
        HttpServer server = GrizzlyHttpServerFactory.createHttpServer(
                runtimeConfig.baseUri(),
                new HrApplicationConfig(runtimeConfig),
                false
        );

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            LOGGER.info("Stopping Jersey runtime");
            server.shutdownNow();
        }));

        server.start();
        LOGGER.info("Jersey runtime listening at {}", runtimeConfig.baseUri());
        Thread.currentThread().join();
    }
}
