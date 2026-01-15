using Xunit;

namespace ElaviewBackend.Tests.Integration.Fixtures;

[CollectionDefinition("Integration")]
public class
    IntegrationTestCollection : ICollectionFixture<IntegrationTestFixture>;