package controllers.graphql

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.ActorMaterializer
import controllers.graphql.jsonProtocols.GraphQLMessage
import controllers.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import graphql.{GraphQL, GraphQLContext, GraphQLContextFactory}
import javax.inject.{Inject, Singleton}
import sangria.execution.Executor
import sangria.renderer.SchemaRenderer

import scala.concurrent.ExecutionContext

@Singleton
class GraphQLController @Inject()(graphQlContextFactory: GraphQLContextFactory,
                                  graphQlExecutor: Executor[GraphQLContext, Unit],
                                  httpHandler: HttpHandler,
                                  webSocketHandler: WebSocketHandler)
                                 (implicit val executionContext: ExecutionContext,
                                  implicit val actorMaterializer: ActorMaterializer) {

  val routes: Route =
    path("graphql") {
      get {
        handleWebSocketMessagesForProtocol(webSocketHandler.handleMessages, "graphql-ws")
      } ~
        post {
          entity(as[GraphQLMessage]) {
            graphQlMessage =>
              httpHandler.handleQuery(graphQlMessage)
          } ~
            entity(as[Seq[GraphQLMessage]]) {
              graphQlMessages =>
                httpHandler.handleBatchQuery(graphQlMessages)
            }
        }
    } ~
      (path("schema") & get) {
        complete(SchemaRenderer.renderSchema(GraphQL.schema))
      } ~
      (path("graphiql") & get) {
        getFromResource("web/graphiql.html")
      }
}